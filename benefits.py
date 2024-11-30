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
scraped_text_file_path = r'C:\Users\rugved\OneDrive\Documents\5semcolne\E-yojana\public\scraped_texts.csv'
scraped_details_file_path = r'C:\Users\rugved\OneDrive\Documents\5semcolne\E-yojana\public\scraped_details.csv'
output_file_path = r'C:\Users\rugved\OneDrive\Documents\5semcolne\E-yojana\public\benefit.csv'

# Open and read the scraped_details CSV file
with open(scraped_details_file_path, 'r', encoding='utf-8', errors='ignore') as details_file:
    details_reader = csv.DictReader(details_file)
    details_data = {row['scheme_link']: row for row in details_reader}

# Open and read the scraped_text file to get the scheme links
with open(scraped_text_file_path, 'r', encoding='ISO-8859-1', errors='ignore') as scraped_file:
    reader = csv.DictReader(scraped_file)
    
    # Prepare the output file with benefits appended
    fieldnames = ['scheme_link', 'details_text', 'eligibility_text', 'benefit_text']
    
    with open(output_file_path, 'w', newline='', encoding='utf-8') as output_file:
        writer = csv.DictWriter(output_file, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            scheme_link = row['scheme_link']
            
            # Use scheme_link from scraped_text to navigate
            print(f"Processing link: {scheme_link}")
            
            if scheme_link in details_data:
                details_row = details_data[scheme_link]
                details_text = details_row['details_text']
                eligibility_text = details_row['eligibility_text']
            else:
                print(f"Scheme link {scheme_link} not found in details file.")
                continue
            
            # Navigate to the scheme link using Selenium
            driver.get(scheme_link)
            
            try:
                # Wait for the page content to load (timeout: 10 seconds)
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'body'))
                )
                
                # Pass the page source to BeautifulSoup for scraping
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                
                div = soup.find('div', id="scrollDiv")
                
                # Extract benefit information
                benefit = div.find('div', id='benefits') if div else None
                benefit_text = benefit.text.strip() if benefit else 'not available'
                print(benefit_text)
                
                # Append benefit text to the current row
                writer.writerow({
                    'scheme_link': scheme_link,
                    'details_text': details_text,
                    'eligibility_text': eligibility_text,
                    'benefit_text': benefit_text
                })

            except TimeoutException:
                print("Timeout: Element not found or took too long to load.")
                # Append timeout information
                writer.writerow({
                    'scheme_link': scheme_link,
                    'details_text': details_text,
                    'eligibility_text': eligibility_text,
                    'benefit_text': 'Timeout or Error'
                })
                
            except Exception as e:
                print(f"Error processing the scheme link: {e}")
                # Append error message
                writer.writerow({
                    'scheme_link': scheme_link, 
                    'details_text': details_text, 
                    'eligibility_text': eligibility_text,
                    'benefit_text': f'Error: {e}'
                })

            # Add wait time to prevent crashing the site
            time.sleep(5)

# Clean up
driver.quit()
