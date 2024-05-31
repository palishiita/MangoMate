// server/ml-model/predict.js
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import path from 'path';

const modelPath = path.resolve('ml-model/ml-model/model_files/model.keras');
const vectorizerPath = path.resolve('ml-model/ml-model/model_files/vectorizer.json');

let model;
let vectorizerData;

const loadModel = async () => {
  try {
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model file does not exist at path: ${modelPath}`);
    }

    model = await tf.loadLayersModel(`file://${modelPath}`);

    const vectorizerRawData = fs.readFileSync(vectorizerPath, 'utf-8');
    console.log('Raw vectorizer data:', vectorizerRawData);

    vectorizerData = JSON.parse(vectorizerRawData);

    if (!vectorizerData.vocabulary_ || !vectorizerData.idf_ || !vectorizerData.stop_words_) {
      throw new Error('Invalid vectorizer data format.');
    }

    console.log('Model and vectorizer loaded successfully');
  } catch (error) {
    console.error('Error loading model or vectorizer:', error);
  }
};

loadModel();

class TfidfVectorizer {
  constructor(vectorizerData) {
    if (!vectorizerData || !vectorizerData.vocabulary_ || !vectorizerData.idf_ || !vectorizerData.stop_words_) {
      throw new Error('Invalid vectorizer data');
    }
    this.vocabulary = vectorizerData.vocabulary_;
    this.idf = tf.tensor(vectorizerData.idf_);
    this.stopWords = new Set(vectorizerData.stop_words_);
  }

  transform(texts) {
    const sequences = texts.map(text => {
      const tokens = text.split(' ').filter(token => !this.stopWords.has(token));
      const tokenCounts = tokens.reduce((counts, token) => {
        if (this.vocabulary[token]) {
          counts[this.vocabulary[token]] = (counts[this.vocabulary[token]] || 0) + 1;
        }
        return counts;
      }, {});
      const featureArray = Array(Object.keys(this.vocabulary).length).fill(0);
      for (const [key, value] of Object.entries(tokenCounts)) {
        featureArray[key] = value;
      }
      return featureArray;
    });
    return tf.tensor2d(sequences, [sequences.length, Object.keys(this.vocabulary).length]);
  }
}

let vectorizer;

try {
  vectorizer = new TfidfVectorizer(vectorizerData);
} catch (error) {
  console.error('Error creating vectorizer:', error);
}

export const predictComment = async (commentText) => {
  if (!model || !vectorizer) {
    throw new Error('Model or vectorizer not loaded correctly.');
  }

  const sequences = vectorizer.transform([commentText]);
  const prediction = model.predict(sequences);

  return (await prediction.array())[0][0] > 0.5; // Adjust threshold as needed
};