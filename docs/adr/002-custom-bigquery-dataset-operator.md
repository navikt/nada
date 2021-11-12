# Custom BigQuery Dataset Operator

## Date

2021-11-12

## Status

Under consideration

## Background

Currently, naiserator creates BigQuery datasets using the CNRM operator.
This works well, except when we try to modify dataset permissions using Cloud Console or the BigQuery API.

With the new NAV Data solution NADA, we need to update permissions on the dataset to allow for registering BigQuery views.

> **Note:** The permission is to create the view as an authorized view.
This is required to allow for the view to be used without permissions to the underlying data.

When the dataset is created using the CNRM operator, the permissions are synced every 10-30 minutes.
The sync ensures that all permissions are up to date, acording to the spec defined in the kubernetes resource.

## Decision

The decision is to create a custom operator that creates a dataset using the BigQuery API.
This operator will be used to create the dataset and sync the permissions, merging permissions from the Kubernetes resource with those that exist in the BigQuery API.

The operator will reuse the spec defined by the CNRM operator.
This ensures that changes in naiserator is limited, and in the case CNRM implements permission sync in the future, we can easily migrate back to CNRM.

## Consequences

Maintaining a separata operator for creating BigQuery datasets creates an extra maintenance burden, but the current solution is not ideal as of now.
