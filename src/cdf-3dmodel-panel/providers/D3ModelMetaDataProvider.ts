import {
  BlobOutputMetadata,
  CdfModelIdentifier,
  File3dFormat,
  ModelIdentifier,
  ModelMetadataProvider,
} from '@cognite/reveal/extensions/datasource';
import { THREE } from '@cognite/reveal';

export class D3ModelMetaDataProvider implements ModelMetadataProvider {
  getModelUri(identifier: ModelIdentifier, formatMetadata: BlobOutputMetadata): Promise<string> {
    console.log(this);
    if (!(identifier instanceof CdfModelIdentifier)) {
      throw new Error('Unexpected identifier');
    }
    // Base URL of where geometry files are stored
    // This will be passed to ModelDataProvider.getJsonFile() and getBinaryFile()
    return Promise.resolve(`https://localhost/models/${identifier.modelId}/revision/${identifier.revisionId}`);
  }

  getModelCamera(identifier: ModelIdentifier): Promise<{ position: THREE.Vector3; target: THREE.Vector3 } | undefined> {
    console.log(this);
    if (!(identifier instanceof CdfModelIdentifier)) {
      throw new Error('Unexpected identifier');
    }
    // Use default camera
    return Promise.resolve(undefined);
  }

  getModelMatrix(identifier: ModelIdentifier, format: File3dFormat | string): Promise<THREE.Matrix4> {
    console.log(this);
    if (!(identifier instanceof CdfModelIdentifier)) {
      throw new Error('Unexpected identifier');
    }
    // CAD models are usually stored in Z-up, while Reveal uses Y-up, so
    // we need to account for this
    const cadModelToReveal = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    return Promise.resolve(cadModelToReveal);
  }

  getModelOutputs(modelIdentifier: ModelIdentifier): Promise<BlobOutputMetadata[]> {
    console.log(this);
    // Indicates that the supported output for this model is of type File3dFormat.RevealCadModel and version 8

    // BlobId refers to a remote identifier for a blob storage, but since this simply fetches
    // the model locally, it can be set to -1
    return Promise.resolve([
      {
        blobId: -1,
        format: File3dFormat.RevealCadModel,
        version: 8,
      },
    ]);
  }
}
