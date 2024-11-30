from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import urllib.parse
import csv
from category import p_texts  # Make sure 'p_texts' is a list of category names

# Path to your chromedriver
service = Service("C:/chromedriver/chromedriver-win64/chromedriver.exe")
options = Options()
options.add_argument('--headless')  # Optional: Run in headless mode
# options.add_argument('--disable-gpu')  # Uncomment if you have issues with headless mode

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=options)

# Base URL
base_url = 'https://www.myscheme.gov.in/search/category'

# List to store scraped data
scraped_data = []

for p_text in p_texts:
    # URL encode the text
    url_encoded_text = urllib.parse.quote(p_text, safe='')
    
    # Construct the full URL
    full_url = f'{base_url}/{url_encoded_text}'
    print(f"Navigating to: {full_url}")
    
    # Navigate to the target URL
    driver.get(full_url)
    
    # Add a short sleep to ensure the page loads properly
    import time
    time.sleep(5)  # Adjust the sleep time as needed
    
    print("Page loaded")
    
    # Print the page source for debugging
    # print(driver.page_source)
    
    try:
        # Wait for the <div> elements to be present
        WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.flex.flex-col'))
        )
        
        div_elements = driver.find_elements(By.CSS_SELECTOR, '.flex.flex-col')
        # print(f"Found {len(div_elements)} div elements")
        
        for div in div_elements:
            # print("Div HTML:")
            # print(div.get_attribute('outerHTML'))
            
            try:
                # Find the first <span> inside <h2> <a>
                first_span = div.find_element(By.CSS_SELECTOR, 'h2 a span')
                # print(f"Span Text: {first_span.text}")
                span_text = first_span.text

                
                
                print("&&&&&&&&&&&&&&&&&&&&&&&&")
                scheme_links=div.find_element(By.CSS_SELECTOR,'h2 a')
                print("********************")
                print(scheme_links.get_attribute('href'))
                scheme_link=scheme_links.get_attribute('href')
                # Append to the scraped data list
                scraped_data.append({'p_text': p_text, 'span_text': span_text, 'scheme_link':scheme_link})
            except Exception as inner_e:
                print(f"Error finding span in div: {inner_e}")
        

    except Exception as e:
        print(f"An error occurred: {e}")

# Write data to the CSV file
csv_file_path = r'C:\Users\rugved\OneDrive\Documents\5semcolne\E-yojana\public\scraped_texts.csv'
with open(csv_file_path, 'w', newline='') as csvfile:
    fieldnames = ['p_text', 'span_text','scheme_link']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for row in scraped_data:
        writer.writerow(row)

# Clean up
driver.quit()