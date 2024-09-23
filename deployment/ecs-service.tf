resource "aws_ecs_service" "image_upload_service" {
  name            = "Image-upload-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.image_upload_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.rds_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.web_api_target_group.arn
    container_name   = "image-upload-service"
    container_port   = 8081
  }
}

resource "aws_ecs_service" "image_processing_service" {
  name            = "image-processing-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.image_processing_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.rds_sg.id]
    assign_public_ip = true
  }
}
