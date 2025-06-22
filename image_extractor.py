import ast
import pandas as pd

def extract_thumbnail(image_str):
    """
    Safely parses a stringified dictionary and extracts the 'thumbnail' URL.
    Returns None if parsing fails or 'thumbnail' is not present.
    """
    try:
        data_dict = ast.literal_eval(image_str)
        url = data_dict.get('thumbnail')
        return download_image(url)
    except (ValueError, SyntaxError):
        return None
    
import requests
import os

def download_image(image_url, save_path="news_card.png"):
  """Downloads an image from a URL and saves it to a specified path.

  Args:
    image_url: The URL of the image.
    save_path: The path where the image will be saved.
  """
  try:
    response = requests.get(image_url, stream=True)
    response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

    with open(save_path, 'wb') as file:
      for chunk in response.iter_content(chunk_size=8192):
        file.write(chunk)

    print(f"Successfully downloaded image from {image_url} to {save_path}")

  except requests.exceptions.RequestException as e:
    print(f"Error downloading image from {image_url}: {e}")
  except Exception as e:
    print(f"An unexpected error occurred: {e}")
