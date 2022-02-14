import os

THREADS = os.environ["ITK_GLOBAL_DEFAULT_NUMBER_OF_THREADS"]
SUBJECT = os.environ["SUBJECT"]
SUBJECTS_DIR = os.environ["SUBJECTS_DIR"]
filePath = f'{SUBJECTS_DIR}/sourcedata/{SUBJECT}/MR/'

if(os.path.isfile(f'{filePath}T1.nii') == False):
    fileName = os.listdir(filePath)[0]
else:
    fileName = 'T1.nii'

if(fileName.split('.nii')[1]=='.gz'):
    os.system(f'gunzip {filePath}{fileName}')    
    fileName = os.listdir(filePath)[0]

if(fileName != 'T1.nii'):
    os.system(f'mv {filePath}{fileName} {filePath}T1.nii')

if(os.path.isfile(f'{filePath}T1_RAS.nii') == False):
    os.system(f'/home/preprocess/acpcdetect/bin/acpcdetect -v -center-AC -no-tilt-correction -i {filePath}T1.nii')

acpc_aligned_T1 = "T1_RAS.nii"

os.system(f'recon-all -s {SUBJECT} -i {filePath}{acpc_aligned_T1} -openmp {THREADS} -parallel -autorecon1 -notify {SUBJECTS_DIR}/{SUBJECT}/auto1done.txt')
os.system(f'recon-all -s {SUBJECT} -openmp {THREADS} -parallel -autorecon2 -notify {SUBJECTS_DIR}/{SUBJECT}/auto2done.txt')
os.system(f'recon-all -s {SUBJECT} -openmp {THREADS} -parallel -autorecon3 -notify {SUBJECTS_DIR}/{SUBJECT}/auto3done.txt')

os.system(f'mri_convert {SUBJECTS_DIR}/{SUBJECT}/mri/brain.mgz {SUBJECTS_DIR}/{SUBJECT}/reconstruction.nii.gz')

# Cleaned up images for clinical team
os.system(f'mri_binarize --i {SUBJECTS_DIR}/{SUBJECT}/mri/aparc+aseg.mgz --o {SUBJECTS_DIR}/{SUBJECT}/cerebellumRemoved.nii.gz --match 0 7 8 15 16 46 47 --merge {SUBJECTS_DIR}/{SUBJECT}/mri/brain.mgz')