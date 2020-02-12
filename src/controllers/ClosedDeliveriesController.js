import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class ClosedDeliveriesController {
  async update(req, res) {
    const { deliveryman_id, signature_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrada' });
    }

    const signatureFile = await File.findByPk(signature_id);

    if (!signatureFile) {
      return res.status(400).json({ error: 'Assinatura não encontrada' });
    }

    const { id } = req.params;

    const dateNow = new Date();

    const delivery = await Delivery.findOne({
      where: {
        id,
        deliveryman_id,
        end_date: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Encomenda não encontrada' });
    }

    const deliveryUpdated = await delivery.update({
      end_date: dateNow,
      signature_id,
    });

    return res.json(deliveryUpdated);
  }
}

export default new ClosedDeliveriesController();
