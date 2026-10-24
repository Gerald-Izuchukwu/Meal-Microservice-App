output "alb_sg_id" { value = aws_security_group.meal_app_alb_sg.id }
output "nginx_sg_id" { value = aws_security_group.nginx_sg.id }
output "auth_sg_id" { value = aws_security_group.auth_sg.id }
output "product_sg_id" { value = aws_security_group.product_sg.id }
output "order_sg_id" { value = aws_security_group.order_sg.id }
output "delivery_sg_id" { value = aws_security_group.delivery_sg.id }
output "docdb_sg_id" { value = aws_security_group.docdb_sg.id }