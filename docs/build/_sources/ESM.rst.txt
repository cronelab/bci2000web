Cortical Stimulation
==============================================

Getting started
------------------------------------------------

+ Go to `Dashboard <localhost:8090>`_
+ Select a patient from the dropdown menu
+ Select "Cortical Stimulation" from the task bar
+ Modify parameters:

    - Electrodes
    - Current
    - Frequency
    - Duration
    - Notes
+ Select "Task" from dropdown (or "No Task" if titrating)
+ If running a task, select which task from the dropdown
+ Select which effect (or "Clear") was elicited during stimulation

    - If a motor or sensory response was recorded:

        - Select which side of the body the response was recorded from
        - Select which areas on the homonculus
+ Select "Trial complete" to submit the results or "Clear" to undo the result
+ Select "Generate Report" to create a spreadsheet


Breakdown
------------------------------------------------

Electrode selection
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.. image:: ./images/ESM/Electrodes.png

Modifying parameters
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.. image:: ./images/ESM/EditableParameters.png

Task selection
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.. image:: ./images/ESM/TaskSelection.png

Effect selection
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.. image:: ./images/ESM/PositiveEffect.png

Motor and Sensory responses
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

+--------------------------------------------+-------------------------------------------------+
| .. image:: ./images/ESM/MotorResponse.png  | .. image:: ./images/ESM/SensoryResponse.png     |
+--------------------------------------------+-------------------------------------------------+
|                           .. image:: ./images/ESM/MotorAndSensoryLogs.png                    |
+--------------------------------------------+-------------------------------------------------+

Send data to server
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.. image:: ./images/ESM/SendDataToServer.png


Generate report
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.. image:: ./images/ESM/CSVReport.png


Data Structure
------------------------------------------------

.. code-block:: json

    {
        "patientID": "PY#",
        "date": "01/01/20",
        "results": [
            {
                "electrodes": "elec1_elec2",
                "task": "Comprehension (Token)",
                "time": "01:01:01",
                "current": 5,
                "frequency": 50,
                "duration": 5,
                "result": "Language",
                "notes": "Notes placed here.",
                "color": "purple"  
            }
        ]
    }

Example
------------------------------------------------

.. image:: ./images/CorticalStimulation.png
