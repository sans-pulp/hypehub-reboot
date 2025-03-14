# variable "render_api_key" {
#   description = "Render API key"
#   type        = string
#   sensitive   = true
#   default     = "rnd_4ImDTD0VJLsMCPn2PlCjMch5frnN"
# }

# variable "render_plan" {
#   description = "Render service plan (free, starter, standard-2x, etc.)"
#   type        = string
#   default     = "free"
# }

# variable "render_owner_id" {
#   description = "Render owner ID"
#   type        = string
#   default     = "tea-cspvbrogph6c739fq0jg"
# }

# variable "websocket_config" {
#   description = "WebSocket server configuration"
#   type = object({
#     environment      = string
#     allowed_origins = list(string)
#     log_level       = string
#   })
#   default = {
#     environment      = "development"
#     allowed_origins = ["http://localhost:3000"]
#     log_level       = "info"
#   }
# }

variable "github_deploy_key" {
  description = "GitHub deploy key for repository access"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "hypehub-reboot-project"
}

variable "region" {
  description = "The GCP region to deploy resources in"
  type        = string
  default     = "us-central1" # Default to Central US region
}

variable "ansible_public_key" {
  description = "Public key for Ansible SSH access"
  type        = string
} 