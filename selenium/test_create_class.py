from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def test_create_class():
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173/login")
    # Wait for email input to be present
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email']"))
    )
    driver.find_element(By.XPATH, "//input[@placeholder='Enter your email']").send_keys("satya256prakash@gmail.com")
    driver.find_element(By.XPATH, "//input[@placeholder='Enter your password']").send_keys("satya@99380")
    driver.find_element(By.XPATH, "//button[contains(text(),'Sign in')]").click()
    time.sleep(2)
    # Navigate to class creation (update selector as needed)
    try:
        driver.find_element(By.LINK_TEXT, "DashBoard").click()
        time.sleep(1)
        driver.find_element(By.XPATH, "//button[contains(text(),'Create New Class')]").click()
        time.sleep(1)
        # Fill class form (update selectors as needed)
        driver.find_element(By.XPATH, "//input[@name='className']").send_keys("Test Class")
        driver.find_element(By.XPATH, "//button[contains(text(),'Create')]").click()
        time.sleep(2)
        print("Class creation workflow completed.")
    except Exception as e:
        print(f"Class creation workflow failed: {e}")
    # Logout
    try:
        driver.find_element(By.XPATH, "//button[contains(text(),'LogOut')]").click()
        print("Logged out after workflow.")
    except Exception as e:
        print(f"Logout failed: {e}")
    driver.quit()
