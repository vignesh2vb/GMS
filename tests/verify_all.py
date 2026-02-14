
import subprocess
import sys
import time

def run_script(script_name):
    print(f"\n{'='*20} Running {script_name} {'='*20}")
    try:
        result = subprocess.run([sys.executable, script_name], capture_output=True, text=True)
        print(result.stdout)
        if result.returncode != 0:
            print(f"[FAIL] {script_name} FAILED with code {result.returncode}")
            print("Error Output:")
            print(result.stderr)
            return False
        else:
            print(f"[PASS] {script_name} PASSED")
            return True
    except Exception as e:
        print(f"[FAIL] Failed to execute {script_name}: {e}")
        return False

def verify_all():
    scripts = [
        "verify_deployment.py",
        "verify_backend.py",
        "fix_hod.py",
        "reproduce_staff_access.py"
    ]
    
    results = {}
    for script in scripts:
        results[script] = run_script(script)
        time.sleep(1) # Brief pause
        
    print(f"\n{'='*20} FINAL RESULTS {'='*20}")
    all_passed = True
    for script, passed in results.items():
        status = "[PASS]" if passed else "[FAIL]"
        print(f"{script:<25} {status}")
        if not passed:
            all_passed = False
            
    if all_passed:
        print("\n[SUCCESS] ALL SYSTEMS GO! No errors found.")
    else:
        print("\n[WARNING] Some checks failed. Please review the output above.")

if __name__ == "__main__":
    verify_all()
