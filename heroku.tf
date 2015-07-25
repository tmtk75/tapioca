variable "heroku_email" {}
variable "heroku_api_key" {}
variable "app_name" { default = "tapioca" }
variable "github_client_id" {}
variable "github_client_secret" {}
variable "cookie_session_key" {}
variable "password_salt" {}
variable "kii_app_id" {}
variable "kii_app_key" {}
variable "kii_endpoint" {}

provider "heroku" {
    email   = "${var.heroku_email}"
    api_key = "${var.heroku_api_key}"
}

resource "heroku_app" "tapioca" {
    name   = "${var.app_name}"
    region = "us"

    config_vars {
        GITHUB_CLIENT_ID     = "${var.github_client_id}"
        GITHUB_CLIENT_SECRET = "${var.github_client_secret}"
        BASEURL              = "https://${var.app_name}.herokuapp.com"
        COOKIE_SESSION_KEY   = "${var.cookie_session_key}"
        PASSWORD_SALT        = "${var.password_salt}"
        KII_APP_ID           = "${var.kii_app_id}"
        KII_APP_KEY          = "${var.kii_app_key}"
        KII_ENDPOINT         = "${var.kii_endpoint}"
    }
}

