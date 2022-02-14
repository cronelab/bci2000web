FROM continuumio/miniconda3:latest
WORKDIR /home/preprocess

COPY . /home/preprocess/
RUN mkdir /home/preprocess/acpcdetect
RUN tar -zxvpf /home/preprocess/prog/acpcdetect_v2.0_LinuxCentOS6.7.tar.gz -C /home/preprocess/acpcdetect
ENV SUBJECTS_DIR /data
RUN rm /home/preprocess/prog/acpcdetect_v2.0_LinuxCentOS6.7.tar.gz
ENV ARTHOME=/home/preprocess/acpcdetect
ENV PATH=/home/preprocess/acpcdetect/bin:${PATH}

# COPY ./prog/freesurfer-linux-ubuntu18_amd64-7.2.0.tar.gz /home/mne_user/freesurfer-linux-ubuntu18_amd64-7.2.0.tar.gz
RUN mkdir /home/preprocess/freesurfer
# # RUN /bin/sh -c wget https://surfer.nmr.mgh.harvard.edu/pub/dist/freesurfer/7.2.0/freesurfer-linux-ubuntu18_amd64-7.2.0.tar.gz -O fs.tar.gz &&     tar --no-same-owner -xzvf fs.tar.gz &&     mv freesurfer /home/mne_user &&     rm fs.tar.gz
RUN tar -zxvpf /home/preprocess/prog/freesurfer-linux-ubuntu18_amd64-7.2.0.tar.gz -C /home/preprocess
RUN rm /home/preprocess/prog/freesurfer-linux-ubuntu18_amd64-7.2.0.tar.gz
# COPY ./prog/.license /home/mne_user/freesurfer/.license
RUN mv /home/preprocess/prog/.license /home/preprocess/freesurfer/.license
RUN chmod +x /home/preprocess/freesurfer/.license

ENV PATH=/home/preprocess/acpcdetect/bin:/home/preprocess/freesurfer/bin:/home/preprocess/freesurfer/fsfast/bin:/home/preprocess/freesurfer/tktools:/home/preprocess/freesurfer/mni/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${PATH}
ENV FREESURFER_HOME=/home/preprocess/freesurfer
ENV FREESURFER=/home/preprocess/freesurfer
ENV MINC_BIN_DIR=/home/preprocess/freesurfer/mni/bin
ENV MINC_LIB_DIR=/home/preprocess/freesurfer/mni/lib
ENV MNI_DIR=/home/preprocess/freesurfer/mni
ENV MNI_DATAPATH=/home/preprocess/freesurfer/mni/data
ENV MNI_PERL5LIB=/home/preprocess/freesurfer/mni/share/perl5
ENV PERL5LIB=/home/preprocess/freesurfer/mni/share/perl5
# RUN fs_install_mcr R2014b
RUN apt-get update && apt-get upgrade -y && apt-get install -y pnmtopng ffmpeg libsm6 libxext6 mesa-utils tcsh libxt6 bc libatlas3-base unzip libncurses5 curl -y




