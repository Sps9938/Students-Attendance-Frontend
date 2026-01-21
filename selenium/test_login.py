from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

if __name__ == "__main__":
    try:
        def test_login():
            try:
                driver = webdriver.Chrome()
                print("Opened Chrome browser.")
                driver.get("http://localhost:5173/login")
                print(f"Navigated to: {driver.current_url}")
                time.sleep(2)
                if driver.current_url != "http://localhost:5173/login":
                    print("ERROR: Did not navigate to login page. Check frontend server and URL.")
                    input("Press Enter to close the browser...")
                    driver.quit()
                    return
                try:
                    email_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter your email']")
                    password_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password']")
                    print("Found email and password fields.")
                except Exception as e:
                    print(f"ERROR: Could not find input fields. {e}")
                    input("Press Enter to close the browser...")
                    driver.quit()
                    return
                email_input.send_keys("satya256prakash@gmail.com")
                password_input.send_keys("satya@99380")
                print("Entered credentials.")
                try:
                    driver.find_element(By.XPATH, "//button[contains(text(),'Sign in')]").click()
                    print("Clicked Sign in button.")
                except Exception as e:
                    print(f"ERROR: Could not find Sign in button. {e}")
                    input("Press Enter to close the browser...")
                    driver.quit()
                    return
                time.sleep(3)
                try:
                    # Try to find the logout button in the header area
                    # Try to find the logout button with text 'LogOut' (case sensitive)
                    logout_btn = driver.find_element(By.XPATH, "//button[contains(text(),'LogOut')]" )
                    if logout_btn.is_displayed():
                        print("Login successful. LogOut button found in header.")
                        # Click the LogOut button
                        logout_btn.click()
                        print("Clicked LogOut button. Checking for logout...")
                        time.sleep(2)
                        # Check if redirected to login page
                        if "login" in driver.current_url.lower() or "Login" in driver.page_source:
                            print("Logout successful. Redirected to login page.")
                        else:
                            print("Logout button clicked, but not redirected to login page.")
                    else:
                        print("Login failed. LogOut button not visible.")
                except Exception as e:
                    print(f"Login failed. LogOut button not found in header. {e}")
                print("Browser will remain open for observation. Close it manually when done.")
                input("Press Enter to close the browser...")
                driver.quit()
            except Exception as e:
                print(f"ERROR: {e}")
        test_login()
    except Exception as e:
        print(f"TOP-LEVEL ERROR: {e}")
