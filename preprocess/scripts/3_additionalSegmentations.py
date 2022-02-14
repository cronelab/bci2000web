import os

SUBJECT = os.environ["SUBJECT"]

os.system(f'segmentThalamicNuclei.sh {SUBJECT}')
os.system(f'segmentHA_T1.sh {SUBJECT}')
os.system(f'segmentBS.sh {SUBJECT}')