from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import os

app = FastAPI()

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AnswerRequest(BaseModel):
    num1: int
    num2: int
    user_answer: int

@app.get("/question")
def get_question(start: int = 2, end: int = 12):
    if start > end:
        start, end = end, start
        
    num1 = random.randint(start, end)
    num2 = random.randint(1, 10)
    correct_answer = num1 * num2
    
    # Generate robust options (1 correct + 2 random close values)
    options = {correct_answer}
    
    while len(options) < 3:
        # Generate distraction numbers within a reasonable range
        distraction = random.randint(max(1, correct_answer - 12), correct_answer + 12)
        options.add(distraction)
    
    final_options = list(options)
    random.shuffle(final_options)
    
    return {
        "num1": num1, 
        "num2": num2, 
        "options": final_options 
    }

@app.post("/check")
def check_answer(data: AnswerRequest):
    correct_answer = data.num1 * data.num2
    is_correct = data.user_answer == correct_answer
    
    return {
        "correct": is_correct,
        "correct_answer": correct_answer
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)