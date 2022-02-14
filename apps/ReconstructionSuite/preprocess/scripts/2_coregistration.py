import os

SUBJECT = os.environ["SUBJECT"]
SUBJECTS_DIR = os.environ["SUBJECTS_DIR"]
filePath = f'{SUBJECTS_DIR}/sourcedata/{SUBJECT}/CT/'

if(os.path.isfile(f'{filePath}CT.nii') == False):
    fileName = os.listdir(filePath)[0]
else:
    fileName = 'CT.nii'


if(fileName.split('.nii')[1] == '.gz'):
    os.system(f'gunzip {filePath}{fileName}')
    fileName = os.listdir(filePath)[0]

if(fileName != 'CT.nii'):
    os.system(f'mv {filePath}{fileName} {filePath}CT.nii')
    fileName = 'CT.nii'


os.system(
    f'mri_coreg --s {SUBJECT} --mov {filePath}{fileName} --reg {filePath}/register.lta --threads 16')
os.system(
    f'mri_vol2vol --reg {filePath}/register.lta --mov {filePath}{fileName} --fstarg --o {filePath}/coregCT.nii.gz')


# cleaned up CT for localization
os.system(f'cp {filePath}/coregCT.nii.gz {SUBJECTS_DIR}/{SUBJECT}/CT.nii.gz')
os.system(
    f'mri_mask -T 10 {filePath}/coregCT.nii.gz {SUBJECTS_DIR}/{SUBJECT}/mri/brain.mgz {SUBJECTS_DIR}/{SUBJECT}/strippedCT.nii.gz')
