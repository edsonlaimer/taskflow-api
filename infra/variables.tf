variable "aws_region" {
  description = "Região AWS onde a infraestrutura será provisionada."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto, usado para nomear e marcar (tag) os recursos."
  type        = string
  default     = "taskflow-api"
}

variable "environment" {
  description = "Ambiente de implantação (ex.: dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "Tipo da instância EC2 que executará o container da aplicação."
  type        = string
  default     = "t3.micro"
}

variable "app_port" {
  description = "Porta em que a aplicação escuta dentro do container."
  type        = number
  default     = 3000
}

variable "allowed_ssh_cidr" {
  description = "Bloco CIDR autorizado a acessar a instância via SSH."
  type        = string
  default     = "0.0.0.0/0" # Em um cenário real, restringir ao IP da equipe.
}
