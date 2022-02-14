const fetchSubjects = async () => {
  let listPathRes = await fetch(`/api/list`);
  let foundSubjects = await listPathRes.json();
  if (foundSubjects.length > 0) {
    foundSubjects.reverse();
    return foundSubjects;
  }
};

const fetch2DBrain = async (subject) => {
  let response = await fetch(`/api/brain/2D/${subject}`);
  let brainRes = await response.arrayBuffer();
  let binary = "";
  let bytes = [].slice.call(new Uint8Array(brainRes));
  bytes.forEach((b: any) => (binary += String.fromCharCode(b)));
  return `data:image/jpeg;base64,${window.btoa(binary)}`;
};
const fetch2DGeometry = async (subject) => {
  let response = await fetch(`/api/geometry/2D/${subject}`);
  let _response = await response.json();
  return _response;
};

const fetchAnnotations = async (subject) => {
  let response = await fetch(`/api/annotations/${subject}`);
  let { images } = await response.json();
  let imageArray = await Promise.all(
    images.map(async (image) => {
      let imageReq = await fetch(
        `/api/annotation/${subject}/${image.split(".").slice(0, -1).join(".")}`
      );
      let imageRes = await imageReq.arrayBuffer();
      let binary = "";
      let bytes = [].slice.call(new Uint8Array(imageRes));
      bytes.forEach((b: any) => (binary += String.fromCharCode(b)));
      return `data:image/jpeg;base64,${window.btoa(binary)}`;
    })
  );
  return imageArray;
};

const fetchAnatomicalLocations = async (subject) => {
  let response = await fetch(`/api/anatomy/${subject}`);
  let _response = null;
  if (response.status != 204) {
    _response = await response.json();
  }
  return _response;
};

export {
  fetchSubjects,
  fetch2DBrain,
  fetch2DGeometry,
  fetchAnatomicalLocations,
  fetchAnnotations,
};
