## Table of contents

### BCI Utilities Functions

- [connectToBCIOperator](../wiki/Exports#connecttobcioperator)
- [connectToBCISource](../wiki/Exports#connecttobcisource)
- [setupBCI](../wiki/Exports#setupbci)

### CSS Utilities Functions

- [getSelectableItems](../wiki/Exports#getselectableitems)
- [revertAllItems](../wiki/Exports#revertallitems)
- [switchItem](../wiki/Exports#switchitem)

### Cursor Utilities Functions

- [bciMover](../wiki/Exports#bcimover)
- [virtualClick](../wiki/Exports#virtualclick)

## BCI Utilities Functions

### connectToBCIOperator

▸ `Const` **connectToBCIOperator**(): `Promise`<any\>

Will change the border color on a selectable element between red and white

#### Returns

`Promise`<any\>

the bciOperatorConnection

#### Defined in

[bciController.ts:13](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/bciController.ts#L13)

___

### connectToBCISource

▸ `Const` **connectToBCISource**(): `Promise`<any\>

Will change the border color on a selectable element between red and white

#### Returns

`Promise`<any\>

the bciDataConnection

#### Defined in

[bciController.ts:30](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/bciController.ts#L30)

___

### setupBCI

▸ `Const` **setupBCI**(`bci`): `Promise`<void\>

Will change the border color on a selectable element between red and white

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bci` | `any` | the current bci operator object |

#### Returns

`Promise`<void\>

#### Defined in

[bciController.ts:46](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/bciController.ts#L46)

___

## CSS Utilities Functions

### getSelectableItems

▸ `Const` **getSelectableItems**(): `Element`[]

#### Returns

`Element`[]

returns all the selectable elements on the page

#### Defined in

[cssController.ts:11](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/cssController.ts#L11)

___

### revertAllItems

▸ `Const` **revertAllItems**(): `void`

#### Returns

`void`

#### Defined in

[cssController.ts:33](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/cssController.ts#L33)

___

### switchItem

▸ `Const` **switchItem**(`item`, `state`): `void`

Will change the border color on a selectable element between red and white

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `Element` |
| `state` | `boolean` |

#### Returns

`void`

#### Defined in

[cssController.ts:22](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/cssController.ts#L22)

___

## Cursor Utilities Functions

### bciMover

▸ `Const` **bciMover**(`direction`): `Promise`<void\>

Slowly moves the virtual mouse a small distance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `direction` | `string` | left/right/up/down |

#### Returns

`Promise`<void\>

#### Defined in

[cursorController.ts:19](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/cursorController.ts#L19)

___

### virtualClick

▸ `Const` **virtualClick**(): `void`

Clicks the virtual mouse

#### Returns

`void`

#### Defined in

[cursorController.ts:50](https://github.com/cronelab/NAVI/blob/a87b034/src/Utilities/cursorController.ts#L50)
