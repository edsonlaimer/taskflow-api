output "instance_public_ip" {
  description = "IP público da instância que executa a aplicação."
  value       = aws_instance.app.public_ip
}

output "app_url" {
  description = "URL de acesso à API."
  value       = "http://${aws_instance.app.public_ip}:${var.app_port}"
}
