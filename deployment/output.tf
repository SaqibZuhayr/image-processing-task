output "image_upload_service_url" {
    value = aws_ecs_service.image_upload_service.load_balancer[0].dns_name
  }
  
  output "image_processing_service_url" {
    value = aws_ecs_service.image_processing_service.load_balancer[0].dns_name
  }