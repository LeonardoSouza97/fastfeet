import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class DeliveriesClosedController {
  async index(req, res) {
    const { deliveryman_id } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        end_date: { [Op.ne]: null },
      },
    });

    return res.json(deliveries);
  }
}

export default new DeliveriesClosedController();
