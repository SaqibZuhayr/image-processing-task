resource "aws_ecs_cluster" "app_cluster" {
  name = "image-processing-cluster"
}

resource "aws_ecs_task_definition" "image_upload_task" {
  family                   = "image-upload-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "image-upload-api",
      image = "${aws_ecr_repository.image_upload_ecr.repository_url}:latest",
      portMappings = [
        {
          containerPort = 8081,
          hostPort      = 8081
        }
      ],
      environment = [
        {
          name  = "NODE_ENV",
          value = "production"
        },
        {
          name  = "PORT",
          value = "8081"
        },
        {
          name  = "DB_HOST",
          value = aws_rds_cluster_instance.image_upload_aurora_postgres_instance.endpoint
        },
        {
          name  = "DB_PORT",
          value = "5432"
        },
        {
          name  = "DB_USERNAME",
          value = aws_rds_cluster.image_upload_aurora_postgres.database_username
        },
        {
          name  = "DB_PASSWORD",
          value = aws_rds_cluster.image_upload_aurora_postgres.database_password
        },
        {
          name  = "DB_NAME",
          value = aws_rds_cluster.image_upload_aurora_postgres.database_name
        },
        {
          name  = "AWS_REGION",
          value = data.aws_region.current.name
        },
        {
          name  = "AWS_ACCESS_KEY_ID",
          value = var.aws_access_key_id
        },
        {
          name  = "AWS_SECRET_ACCESS_KEY",
          value = var.aws_secret_access_key
        },
        {
          name  = "S3_IMAGE_BUCKET_NAME",
          value = aws_s3_bucket.image_processing_bucket.bucket
        },
        {
          name  = "AWS_ACCOUNT_ID",
          value = data.aws_caller_identity.current.account_id
        },
        {
          name  = "IMAGE_PROCESSING_QUEUE",
          value = aws_sqs_queue.image_processing_queue.url
        },
        {
          name  = "AWS_SQS_HOST",
          value = "https://sqs.${data.aws_region.current.name}.amazonaws.com/"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.image_upload_log_group.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  task_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_task_definition" "image_processing_task" {
  family                   = "image-processing-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "image-processing-service",
      image = "${aws_ecr_repository.image_processing_ecr.repository_url}:latest",
      environment = [
        {
          name  = "NODE_ENV",
          value = "production"
        },
        {
          name  = "PORT",
          value = "8082"
        },
        {
          name  = "AWS_REGION",
          value = data.aws_region.current.name
        },
        {
          name  = "AWS_ACCESS_KEY_ID",
          value = var.aws_access_key_id
        },
        {
          name  = "AWS_SECRET_ACCESS_KEY",
          value = var.aws_secret_access_key
        },
        {
          name  = "S3_IMAGE_BUCKET_NAME",
          value = aws_s3_bucket.image_processing_bucket.bucket
        },
        {
          name  = "AWS_ACCOUNT_ID",
          value = data.aws_caller_identity.current.account_id
        },
        {
          name  = "AWS_REGION",
          value = data.aws_region.current.name
        },
        {
          name  = "IMAGE_PROCESSING_QUEUE",
          value = aws_sqs_queue.image_processing_queue.url
        },
        {
          name  = "SMTP_HOST_NAME",
          value = var.smtp_host_name
        },
        {
          name  = "SMTP_PORT",
          value = var.smtp_port
        },
        {
          name  = "SMTP_USERNAME",
          value = var.smtp_username
        },
        {
          name  = "SMTP_PASSWORD",
          value = var.smtp_password
        },
        {
          name  = "SMTP_FROM",
          value = "loremipsem@loremipsem.com"
        },
        {
          name  = "SMTP_TO",
          value = "loremipsem@loremipsem.com"
        },
        {
          name  = "SMTP_TO_ADMIN",
          value = "loremipsem@loremipsem.com"
        },
        {
          name  = "AWS_SQS_HOST",
          value = "https://sqs.${data.aws_region.current.name}.amazonaws.com/"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.image_processing_log_group.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  task_role_arn = aws_iam_role.ecs_task_execution_role.arn
}