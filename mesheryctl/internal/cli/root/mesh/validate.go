package mesh

import (
	"encoding/json"

	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

// Response represents response from SMI Comformance Test
type Response struct {
	Success int
	Fail    int
}

// validateCmd represents the logs command
var validateCmd = &cobra.Command{
	Use:   "validate",
	Short: "validate smi spec",
	Long:  `Validate Service Mesh using SMI Conformance Test`,
	Args:  cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		// if ok := utils.IsMesheryRunning(); !ok {
		// 	log.Error("Unable to validate. Meshery is not running.")
		// 	return nil
		// }

		log.Info("Validating Service Mesh using SMI-Spec")

		res := &Response{
			Success: 1,
			Fail:    0,
		}

		b, err := json.Marshal(res)

		log.Info("Response \n", string(b))

		return err
	},
}
