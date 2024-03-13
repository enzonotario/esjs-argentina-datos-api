#!/bin/bash

OUTPUT_FILE="../datos/v1/finanzas/tasas/plazosFijos/index.json"
INDEX_FILE="../datos/v1/finanzas/tasas/plazoFijo/index.json"


# Crear un archivo vacío para el historial
echo "[]" > $OUTPUT_FILE

# Obtener la lista de commits en orden cronológico
COMMITS=$(git log --reverse --format=%H -- $INDEX_FILE)

# Inicializar variables para controlar la fecha y la información del día actual
FECHA_ACTUAL=""
PLAZOS_FIJOS_ACTUALES="[]"

# Recorrer cada commit y agregar la información al historial
for COMMIT in $COMMITS
do
    # Obtener la fecha del commit actual
    FECHA=$(git show --format=%ci -s $COMMIT | cut -d' ' -f1)

    # Si es un nuevo día, agregar la información del día anterior al historial
    if [ "$FECHA" != "$FECHA_ACTUAL" ]; then
        # Verificar si hay información del día anterior para agregar
        if [ "$PLAZOS_FIJOS_ACTUALES" != "[]" ]; then
            jq --arg fecha "$FECHA_ACTUAL" --argjson plazosFijos "$PLAZOS_FIJOS_ACTUALES" '. += [{"fecha": $fecha, "plazosFijos": $plazosFijos}]' $OUTPUT_FILE > tmp.json && mv tmp.json $OUTPUT_FILE
        fi

        # Reiniciar las variables para el nuevo día
        FECHA_ACTUAL="$FECHA"
        PLAZOS_FIJOS_ACTUALES="[]"
    fi

    # Obtener la información del archivo en el commit actual
    INFO=$(git show $COMMIT:$INDEX_FILE)

    # Agregar la información al día actual
    PLAZOS_FIJOS_ACTUALES=$(jq --argjson info "$INFO" '. += [$info[]]' <<< "$PLAZOS_FIJOS_ACTUALES")
done

# Agregar la información del último día al historial
if [ "$PLAZOS_FIJOS_ACTUALES" != "[]" ]; then
    jq --arg fecha "$FECHA_ACTUAL" --argjson plazosFijos "$PLAZOS_FIJOS_ACTUALES" '. += [{"fecha": $fecha, "plazosFijos": $plazosFijos}]' $OUTPUT_FILE > tmp.json && mv tmp.json $OUTPUT_FILE
fi
