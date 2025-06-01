import { Router } from 'express';
import { validateAnswers }  from '../middleware/validateAnswers';
import { validateAnswer }   from '../middleware/validateAnswer';
import {
  getQuestions,
  postAnswer,
  postAnswers,
} from '../controllers/advisorController';

const r = Router();

r.get ('/advisor/questions', getQuestions);
r.post('/advisor/answer',   validateAnswer,  postAnswer);
r.post('/advisor/answers',  validateAnswers, postAnswers);

export default r;
