resource "aws_rds_cluster" "image_upload_aurora_postgres" {
  cluster_identifier      = "image-upload-aurora-postgres"
  engine                  = "aurora-postgresql"
  engine_version          = "15.4"
  database_name           = "image_upload_db"
  master_username         = "dbuser"
  master_password         = "dbpassword"
  skip_final_snapshot     = true
  apply_immediately       = true
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  backup_retention_period = 7
  preferred_backup_window = "03:00-04:00"
}

resource "aws_rds_cluster_instance" "image_upload_aurora_postgres_instance" {
  identifier          = "image-upload-aurora-postgres-instance"
  cluster_identifier  = aws_rds_cluster.image_upload_aurora_postgres.id
  instance_class      = "db.t3.medium"
  engine              = "aurora-postgresql"
  publicly_accessible = true
  apply_immediately   = true
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

# SQL schema for image upload
resource "null_resource" "create_image_upload_schema" {
  provisioner "local-exec" {
    command = <<EOT
      PGPASSWORD=${aws_rds_cluster.image_upload_aurora_postgres.master_password} psql \
      -h ${aws_rds_cluster.image_upload_aurora_postgres.endpoint} \
      -U ${aws_rds_cluster.image_upload_aurora_postgres.master_username} \
      -d image_upload_db -c "
      CREATE SCHEMA image_upload AUTHORIZATION ${aws_rds_cluster.image_upload_aurora_postgres.master_username};
      "
EOT
  }
  depends_on = [aws_rds_cluster_instance.image_upload_aurora_postgres_instance]
}
