resource "aws_cloudwatch_log_group" "image_upload_log_group" {
  name = "/aws/ecs/image-upload-log-group"
}

resource "aws_cloudwatch_log_group" "image_processing_log_group" {
  name = "/aws/ecs/image-processing-log-group"
}