resource "aws_ecr_repository" "image_upload_ecr" {
  name = "image-upload-service"
}

resource "aws_ecr_repository" "image_processing_ecr" {
  name = "image-processing-service"
}