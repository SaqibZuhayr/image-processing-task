resource "aws_lb" "image_upload_lb" {
  name               = "image-upload-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.image_processing_alb_sg.id]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_target_group" "image_upload_target_group" {
  name        = "image-upload-tg"
  port        = 8081
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "image_upload_listener" {
  load_balancer_arn = aws_lb.image_upload_lb.arn
  port              = 8081
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.image_upload_target_group.arn
  }
}