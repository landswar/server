-- Databases :  `landswar`
--
CREATE DATABASE IF NOT EXISTS landswar CHARACTER SET utf8;
USE landswar;

-- --------------------------------------------------------

--
-- Table `damages`
--

CREATE TABLE `damages` (
  `id` int(11) NOT NULL,
  `id_unit_att` int(11) NOT NULL,
  `id_unit_def` int(11) NOT NULL,
  `damage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `damages` (`id`, `id_unit_att`, `id_unit_def`, `damage`) VALUES
(1, 1, 1, 55);

-- --------------------------------------------------------

--
-- Table `grounds`
--

CREATE TABLE `grounds` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `defense` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `grounds` (`id`, `name`, `defense`) VALUES
(1, 'plain', 1),
(2, 'wood', 2),
(3, 'mountain', 4),
(4, 'road', 1);

-- --------------------------------------------------------

--
-- Table `ground_penalties`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `max_player` int(11) NOT NULL,
  `shortid` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table `ground_penalties`
--

CREATE TABLE `ground_penalties` (
  `id` int(11) NOT NULL,
  `id_ground` int(11) NOT NULL,
  `id_unit` int(11) NOT NULL,
  `penalty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `ground_penalties` (`id`, `id_ground`, `id_unit`, `penalty`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 2),
(4, 4, 1, 1);

-- --------------------------------------------------------

--
-- Table `ground_penalties`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `nickname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `life` int(11) NOT NULL,
  `ammo1` int(11) NOT NULL,
  `ammo2` int(11) DEFAULT NULL,
  `fuel` int(11) NOT NULL,
  `vision` int(11) NOT NULL,
  `move` int(11) NOT NULL,
  `rangeMin` int(11) NOT NULL,
  `rangeMax` int(11) NOT NULL,
  `cost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `units` (`id`, `name`, `life`, `ammo1`, `ammo2`, `fuel`, `vision`, `move`, `rangeMin`, `rangeMax`, `cost`) VALUES
(1, 'infantry', 10, 99, NULL, 99, 2, 3, 1, 1, 1000);


--
-- Index for `damages`
--
ALTER TABLE `damages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `damages_units_att` (`id_unit_att`),
  ADD KEY `damages_units_def` (`id_unit_def`);

--
-- Index `grounds`
--
ALTER TABLE `grounds`
  ADD PRIMARY KEY (`id`);

--
-- Index for `ground_penalties`
--
ALTER TABLE `ground_penalties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ground_penalties_grounds` (`id_ground`),
  ADD KEY `ground_penalties_units` (`id_unit`);

--
-- Index for `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Index for `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`,`shortid`);

--
-- Index for `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);


--
-- AUTO_INCREMENT for `damages`
--
ALTER TABLE `damages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for `grounds`
--
ALTER TABLE `grounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for `ground_penalties`
--
ALTER TABLE `ground_penalties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for `damages`
--
ALTER TABLE `damages`
  ADD CONSTRAINT `damages_units_att` FOREIGN KEY (`id_unit_att`) REFERENCES `units` (`id`),
  ADD CONSTRAINT `damages_units_def` FOREIGN KEY (`id_unit_def`) REFERENCES `units` (`id`);

--
-- Constraints for `ground_penalties`
--
ALTER TABLE `ground_penalties`
  ADD CONSTRAINT `ground_penalties_grounds` FOREIGN KEY (`id_ground`) REFERENCES `grounds` (`id`),
  ADD CONSTRAINT `ground_penalties_units` FOREIGN KEY (`id_unit`) REFERENCES `units` (`id`);
