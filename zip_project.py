import zipfile
import os

def zip_directory(folder_path, output_path):
    print(f"Zipping directory: {folder_path} to {output_path}")
    count = 0
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            # Exclude directories
            dirs[:] = [d for d in dirs if d not in ['node_modules', '__pycache__', '.git', '.agent', '.gemini', '.vscode']]
            
            for file in files:
                if file == os.path.basename(output_path) or file.endswith('.zip') or file.endswith('.pyc'):
                    continue
                    
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_path)
                try:
                    zipf.write(file_path, arcname)
                    count += 1
                except Exception as e:
                    print(f"Failed to zip {file_path}: {e}")
    print(f"Successfully created {output_path} with {count} files.")

if __name__ == "__main__":
    # Get the current working directory
    current_dir = os.getcwd()
    # Name the zip file
    zip_name = "project_backup.zip"
    # Create the zip
    zip_directory(current_dir, zip_name)
