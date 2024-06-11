from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn as nn
import torch

from toxic_comment.logger import logging

logger = logging.getLogger(__name__)

# Replace 'bert_model/' with a valid model identifier
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModelForSequenceClassification.from_pretrained('bert-base-uncased')
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

def check_text_toxicity(text) -> dict:
    ''' Check the text for toxicity

        Parameters:
        - text: str

        Returns:
        - dict
    '''
    try:
        logger.info('Started checking toxicity...')
        inputs = tokenizer(text, return_tensors='pt').to(device)
        outputs = model(**inputs)
        sigmoid = nn.Sigmoid()
        probabilities = sigmoid(outputs.logits)
        probabilities = probabilities.to('cpu').detach().numpy()
        id2label = model.config.id2label
        index = 0
        result = {
            'status': 1,
            'message': 'Request successful',
            'response': {
                'toxic': False,
                'severe_toxic': False,
                'obscene': False,
                'threat': False,
                'insult': False,
                'identity_hate': False
            }
        }
        for _, v in id2label.items():
            if probabilities[0][index] > 0.85:
                result['response'][v] = True
            index += 1

        logger.info('Success...')

    except Exception as e:
        logger.info(f'Failure: {e}')
        result = {
            'status': -1,
            'message': 'Error at the model level.',
            'response': {}
        }
    return result
