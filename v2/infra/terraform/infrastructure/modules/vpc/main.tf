resource "aws_vpc" "MealAppVpc" {

    cidr_block = "10.0.0.0/16"

    tags = {
      Name = "Meal App VPC"
      Environment = "Production"
    }
  
}

resource "aws_subnet" "public" {
  vpc_id = aws_vpc.MealAppVpc.id
  cidr_block = "10.0.0.0/24"
  tags = {
    Name = "Meal App Public Subnet"
    Environment = "Production"
  }
}

resource "aws_subnet" "private" {
  vpc_id = aws_vpc.MealAppVpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "Meal App private Subnet"
    Environment = "Production"
  }
}