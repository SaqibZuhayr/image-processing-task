resource "aws_sqs_queue" "image_processing_queue" {
    name = "image-processing-queue"
  }