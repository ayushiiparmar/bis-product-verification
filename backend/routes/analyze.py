from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("/api/analyze")
async def analyze_product(file: UploadFile = File(...)):
    return {
        "message": "Image received successfully",
        "filename": file.filename,
        "content_type": file.content_type
    }
