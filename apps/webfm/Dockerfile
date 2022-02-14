FROM node:latest as server-stage

RUN apt-get update || : && apt-get install python python-pip -y
RUN pip install -U Sphinx sphinx_js sphinx_rtd_theme
RUN npm i -g typedoc

WORKDIR /usr/src/webrain
COPY ./package*.json ./
RUN npm ci
EXPOSE 8090
COPY . .
RUN npm run build
# RUN sphinx-build -b html docs/source docs/build

# CMD [ "npm", "run", "start" ]

# FROM scratch AS export-stage
# COPY --from=server-stage /webfm/docs/build /
# # docker build . -o docs/build -t cronelab/webrain:latest