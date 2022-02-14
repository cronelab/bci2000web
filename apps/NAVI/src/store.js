import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

export const useStore = create(
  // persist(
    subscribeWithSelector(() => ({
      subject: '',
      record: '',
      brain: '',
      geometry: '',
      homonculusSelection: '',
      activeElectrodes: '',
      cortStimParams: '',
      notes: '',
      recordName: '',
      taskName: '',
      subjectSelected: ''
      
    }))
    // ,
    // {
    //   name: 'test',
    // }
  // )
)
mountStoreDevtool('Store', useStore)
