# imports the settings absolutely to avoid possible
# import problems

import sys
import os.path

base_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
sys.path.insert(0, base_root)
from base import *
sys.path.remove(base_root)
