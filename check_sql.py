
import sys

def check_sql_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line or line.startswith('--') or line.startswith('INSERT'):
            continue
        
        quote_count = line.count("'")
        if quote_count % 2 != 0:
            print(f"Error on line {i+1}: Odd number of single quotes ({quote_count})")
            print(f"Content: {line}")
        
        if not (line.endswith('),') or line.endswith(');')):
             if i > 4 and i < len(lines) - 1:
                print(f"Structure Error on line {i+1}: Does not end with '),' or ');'")
                print(f"Content: {line}")

if __name__ == "__main__":
    check_sql_file('c:/Users/cleve/.gemini/antigravity/scratch/crm-system/migration_import_abril.sql')
