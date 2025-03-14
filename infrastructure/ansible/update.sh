#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting HypeHub update process...${NC}"

# Run the update playbook
ansible-playbook -i inventory/hosts.yml update.yml

# Check the exit status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Update completed successfully!${NC}"
else
    echo -e "${YELLOW}Update encountered some issues. Please check the output above.${NC}"
fi 