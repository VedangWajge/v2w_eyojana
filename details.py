from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup
import csv
import time

# Path to your chromedriver
service = Service("C:/chromedriver/chromedriver-win64/chromedriver.exe")
options = Options()
options.add_argument('--headless')  # Optional: Run in headless mode

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=options)

# Paths to your CSV files
input_csv_file_path = r'C:\Users\rugved\OneDrive\Documents\5semcolne\E-yojana\public\scraped_texts.csv'
output_csv_file_path = r'C:\Users\rugved\OneDrive\Documents\5semcolne\E-yojana\public\scraped_details.csv'

# Open and read the input CSV file with ISO-8859-1 encoding
with open(input_csv_file_path, 'r', encoding='ISO-8859-1', errors='ignore') as csvfile:
    reader = csv.DictReader(csvfile)
    
    # Open the output CSV file for writing with 'utf-8' encoding
    with open(output_csv_file_path, 'w', newline='', encoding='utf-8') as csvfile_out:
        fieldnames = ['scheme_link', 'details_text', 'eligibility_text']
        writer = csv.DictWriter(csvfile_out, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            scheme_link = row['scheme_link']
            
            print(f"Processing link: {scheme_link}")
            
            # Navigate to each scheme link using Selenium
            driver.get(scheme_link)
            
            try:
                # Wait for the page content to load (timeout: 10 seconds)
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'body'))
                )
                
                # Pass the page source to BeautifulSoup for scraping
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                
                # Extract the details text (using BeautifulSoup instead of Selenium)
                details_div = soup.select_one('.px-3.md\\:px-6.my-4 .mb-2 span span span')
                details_text = details_div.get_text(strip=True) if details_div else 'Not Found'

                # Extract the eligibility text
                eligibility_div = soup.select_one('#benefits .markdown-options')
                eligibility_text = eligibility_div.get_text(strip=True) if eligibility_div else 'Not Found'
                
                print(details_text)
                print(eligibility_text)
                
                # Write the scheme link, details text, and eligibility text to the output CSV file
                writer.writerow({
                    'scheme_link': scheme_link, 
                    'details_text': details_text, 
                    'eligibility_text': eligibility_text
                })

            except TimeoutException:
                print("Timeout: Element not found or took too long to load.")
                # Write the scheme link with error messages
                writer.writerow({
                    'scheme_link': scheme_link, 
                    'details_text': 'Timeout or Error', 
                    'eligibility_text': 'Timeout or Error'
                })
                
            except Exception as e:
                print(f"Error processing the scheme link: {e}")
                # Write the scheme link with the error message
                writer.writerow({
                    'scheme_link': scheme_link, 
                    'details_text': f'Error: {e}', 
                    'eligibility_text': f'Error: {e}'
                })

            # Add a short sleep to prevent overwhelming the server
            time.sleep(3)

# Clean up
driver.quit()
