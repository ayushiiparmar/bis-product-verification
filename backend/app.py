from fastapi import FastAPI
from backend.routes.analyze import router as analyze_router

app = FastAPI(
    title="BIS Product Verification API",
    description="Backend API for the BIS product verification system",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "BIS Product Verification API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


app.include_router(analyze_router)