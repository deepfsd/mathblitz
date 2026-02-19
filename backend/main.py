import os
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [url.strip() for url in frontend_url.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnswerRequest(BaseModel):
    numbers: list[int]  # Now accepts an array of numbers
    user_answer: int

# --- MULTIPLICATION ENDPOINT ---
@app.get("/question/multiplication")
def get_multiplication(start: int = 2, end: int = 12):
    if start > end:
        start, end = end, start
        
    num1 = random.randint(start, end)
    num2 = random.randint(1, 10)
    correct_answer = num1 * num2
    
    options = {correct_answer}
    while len(options) < 4:
        distraction = random.randint(max(1, correct_answer - 12), correct_answer + 12)
        options.add(distraction)
    
    final_options = list(options)
    random.shuffle(final_options)
    
    return {"numbers": [num1, num2], "operator": "×", "options": final_options}

# --- ADDITION ENDPOINT ---
@app.get("/question/addition")
def get_addition(digits: int = 2, terms: int = 2):
    # Calculate the range based on the number of digits
    min_val = 1 if digits == 1 else 10**(digits - 1)
    max_val = (10**digits) - 1
    
    # Generate all numbers using the same digit constraint
    numbers = [random.randint(min_val, max_val) for _ in range(terms)]
    
    correct_answer = sum(numbers)
    
    options = {correct_answer}
    while len(options) < 4:
        variations = [
            correct_answer + random.randint(1, 5),
            correct_answer - random.randint(1, 5),
            correct_answer + 10,
            correct_answer - 10,
            correct_answer + 100 if digits > 2 else correct_answer + 2
        ]
        options.add(random.choice(variations))
    
    final_options = list(options)
    random.shuffle(final_options)
    
    return {"numbers": numbers, "operator": "+", "options": final_options}


@app.post("/check")
def check_answer(data: AnswerRequest, mode: str = "multiplication"):
    if mode == "addition":
        correct_answer = sum(data.numbers)
    else:
        correct_answer = data.numbers[0] * data.numbers[1]
        
    is_correct = data.user_answer == correct_answer
    return {"correct": is_correct, "correct_answer": correct_answer}