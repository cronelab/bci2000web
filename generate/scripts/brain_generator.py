import json
import os
import sys

import bpy


def _convert_materialcolors_to_rgb(matcolors_dict, region_name):
    """Convert material colors for each brain region to RGB value."""
    if region_name not in matcolors_dict:
        raise RuntimeError(
            f"Region name {region_name} was not found in the "
            f"material colors JSON file."
        )

    region_color = matcolors_dict[region_name]
    r = float(region_color[0] / 255)
    g = float(region_color[1] / 255)
    b = float(region_color[2] / 255)
    return r, g, b


def main():
    # Create ``.glb`` Blender files for brain regions.
    fs_subjects_dir = os.environ.get("SUBJECTS_DIR")
    subject = os.environ.get("SUBJECT")
    subjects_dir = f"{fs_subjects_dir}/{subject}"

    with open("/home/generate/scripts/octave/materialColors.json", "r", encoding="utf-8") as json_file:
        data = json.load(json_file)
    #
    scn = bpy.context.scene
    if not scn.render.engine == "CYCLES":
        scn.render.engine = "CYCLES"

    bpy.ops.object.empty_add()
    bpy.context.active_object.name = "Brain"
    bpy.ops.object.empty_add()
    bpy.context.active_object.name = "Gyri"
    bpy.context.active_object.parent = bpy.data.objects["Brain"]
    bpy.ops.object.empty_add()
    bpy.context.active_object.name = "WhiteMatter"
    bpy.context.active_object.parent = bpy.data.objects["Brain"]
    bpy.ops.object.empty_add()
    bpy.context.active_object.name = "SubcorticalStructs"
    bpy.context.active_object.parent = bpy.data.objects["Brain"]

    for file in os.listdir("{dir}/obj".format(dir=subjects_dir)):
        name = file.split(sep=".obj")[0]

        # get the brain region name
        region_name = os.path.splitext(file)[0]

        # get rgb value for that region
        r, g, b = _convert_materialcolors_to_rgb(
            matcolors_dict=data, region_name=region_name
        )

        if name.endswith("-Cerebral-Cortex") == False:
            bpy.ops.import_scene.obj(
                filepath="{dir}/obj/".format(dir=subjects_dir) + file, axis_forward="Y"
            )
            mat = bpy.data.materials.new("brainMaterial")
            mat.diffuse_color = (r, g, b, 1)
            bpy.data.objects[os.path.splitext(file)[0]].active_material = mat
            # mat.use_nodes = True

            if name.endswith("-Cerebral-Cortex"):
                pass
            elif file[2] == ".":
                bpy.data.objects[os.path.splitext(file)[0]].parent = bpy.data.objects[
                    "Gyri"
                ]
            elif (
                    file == "Left-Cerebral-White-Matter.obj" or
                    file == "Right-Cerebral-White-Matter.obj"
            ):
                bpy.data.objects[os.path.splitext(file)[0]].parent = bpy.data.objects[
                    "WhiteMatter"
                ]
            else:
                bpy.data.objects[os.path.splitext(file)[0]].parent = bpy.data.objects[
                    "SubcorticalStructs"
                ]

    bpy.ops.export_scene.gltf(
        export_format="GLB",
        filepath=f"{subjects_dir}/brain",
        export_texcoords=False,
        export_normals=False,
        export_cameras=False,
        export_yup=False,
    )

    bpy.ops.export_scene.fbx(
        filepath=f"{subjects_dir}/brain.fbx")



if __name__ == "__main__":
    main()