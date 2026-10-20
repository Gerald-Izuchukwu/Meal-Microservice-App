resource "aws_vpc" "MealAppVpc" {

  cidr_block = "10.0.0.0/16"

  tags = {
    Name        = "Meal App VPC"
    Environment = "Production"
  }

}

data "aws_availability_zones" "available" {
  region = var.aws_region
  state  = "available"
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.MealAppVpc.id
  cidr_block = "10.0.0.0/24"
  tags = {
    Name        = "Meal App Public Subnet"
    Environment = "Production"
  }
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.MealAppVpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name        = "Meal App private Subnet"
    Environment = "Production"
  }
}

resource "aws_subnet" "db_private" {
  count             = 2
  vpc_id            = aws_vpc.MealAppVpc.id
  cidr_block        = cidrsubnet(aws_vpc.MealAppVpc.cidr_block, 8, count.index + 2)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name        = "Meal App private Subnet"
    Environment = "Production"
  }

}