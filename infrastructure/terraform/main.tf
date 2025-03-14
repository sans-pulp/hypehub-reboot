# Infrastructure setup for HypeHub Reboot

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.24.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_instance" "hypehub_reboot_instance" {
  name         = "hypehub-reboot-instance"
  machine_type = "e2-micro"
  tags         = ["hypehub-reboot-tag"]
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-lts"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral public IP
    }
  }

  # Simplified startup script - just basic setup
  metadata_startup_script = <<-EOF
    #!/bin/bash
    
    # Update system
    apt-get update
    apt-get upgrade -y

    # Create service user
    useradd -m -s /bin/bash hypehub
    
    # Setup SSH for Ansible
    mkdir -p /home/hypehub/.ssh
    chmod 700 /home/hypehub/.ssh
    echo "${var.ansible_public_key}" >> /home/hypehub/.ssh/authorized_keys
    chmod 600 /home/hypehub/.ssh/authorized_keys
    chown -R hypehub:hypehub /home/hypehub/.ssh
    
    # Allow hypehub user to use sudo without password for Ansible
    echo "hypehub ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/hypehub
  EOF
}

resource "google_compute_firewall" "hypehub_reboot_firewall" {
  name    = "hypehub-reboot-firewall"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443", "8080"]
  }
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["hypehub-reboot-tag"]
}

# Output for Ansible inventory
output "instance_ip" {
  value = google_compute_instance.hypehub_reboot_instance.network_interface[0].access_config[0].nat_ip
  description = "The external IP of the VM instance"
}


