import csv
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Path to your chromedriver
service = Service("C:/chromedriver/chromedriver-win64/chromedriver.exe")
options = Options()
options.add_argument('--headless')  # Optional: Run in headless mode

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=options)

# Navigate to the target URL
driver.get('https://www.myscheme.gov.in')

try:
    # Wait for the grid container to be present
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-5.gap-x-5.md\\:gap-x-10.gap-y-6'))
    )
    
    # Find all <p> tags with the specified class
    p_tags = driver.find_elements(By.CSS_SELECTOR, '.text-base.md\\:text-lg.leading-5.font-normal.dark\\:text-white.transition-all.m-0.ease-in-out')
    
    # Extract text from each <p> tag
    p_texts = [p.text for p in p_tags]

    # Scroll to trigger lazy loading if needed
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)  # Wait for images to load (adjust as needed)

    # Wait for images to be present on the page
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.border-0.w-10.h-10.block'))
    )

    # Find all image elements with the specific classes
    image_elements = driver.find_elements(By.CSS_SELECTOR, '.border-0.w-10.h-10.block')

    # Extract the 'src' and 'srcset' attributes from each image element
    image_links = []
    for element in image_elements:
        # Extract 'src' attribute
        src = element.get_attribute('src')
        if src and not src.startswith('data:image'):
            image_links.append(src)
        
        # # Extract 'srcset' attribute
        # srcset = element.get_attribute('srcset')
        # if srcset:
        #     # Split srcset and take the first URL
        #     srcset_urls = [url.split(' ')[0] for url in srcset.split(',')]
        #     image_links.extend(url for url in srcset_urls if not url.startswith('data:image'))

    # Remove duplicates while preserving order
    def remove_duplicates(seq):
        seen = set()
        return [x for x in seq if not (x in seen or seen.add(x))]

    p_texts = remove_duplicates(p_texts)
    image_links = remove_duplicates(image_links)

    import csv

    csv_file_path = r'C:\Users\rugved\OneDrive\Documents\5semcolne\E-yojana\public\scraped_data.csv'

    with open(csv_file_path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write column headings
        writer.writerow(['Text', 'Image Link'])
        
        # Write rows with text and link
        for text, link in zip(p_texts, image_links):
            writer.writerow([text, link])
        
        # Handle if texts and links are of different lengths
        if len(p_texts) > len(image_links):
            for text in p_texts[len(image_links):]:
                writer.writerow([text, ""])
        elif len(image_links) > len(p_texts):
            for link in image_links[len(p_texts):]:
                writer.writerow(["", link])

    print(f"Data written to {csv_file_path}")


except Exception as e:
    print(f"An error occurred: {e}")

finally:
    driver.quit()
