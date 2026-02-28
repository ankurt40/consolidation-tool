-- Create employee table
CREATE TABLE IF NOT EXISTS employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert 5 sample employees
INSERT INTO employee (name, email, position, department) VALUES
('John Doe', 'john.doe@company.com', 'Software Engineer', 'Engineering'),
('Jane Smith', 'jane.smith@company.com', 'Product Manager', 'Product'),
('Mike Johnson', 'mike.johnson@company.com', 'Senior Developer', 'Engineering'),
('Sarah Williams', 'sarah.williams@company.com', 'UX Designer', 'Design'),
('Robert Brown', 'robert.brown@company.com', 'Data Analyst', 'Analytics');

