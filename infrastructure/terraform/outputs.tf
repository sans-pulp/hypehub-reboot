output "vm_external_ip" {
  value = google_compute_instance.hypehub_reboot_instance.network_interface[0].access_config[0].nat_ip
  description = "The external IP of the VM instance"
} 